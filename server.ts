import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limits for base64 book cover images and attached documents
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Helper to initialize Gemini GenAI client lazily on demand
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Helper to execute Gemini content generation with retry and model fallback on transient 503/429 spikes
async function generateWithFallback(
  getCallParams: (model: string) => {
    contents: any;
    config?: any;
  }
) {
  const ai = getGenAI();
  const models = [
    "gemini-3.1-flash-lite",
    "gemini-3-flash-preview",
    "gemini-flash-latest",
    "gemini-3.8-flash",
  ];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const params = getCallParams(model);
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errString = `${err?.message || ""} ${err?.status || ""} ${JSON.stringify(err || {})}`;
        const isTemporaryBusy =
          errString.includes("503") ||
          errString.includes("high demand") ||
          errString.includes("UNAVAILABLE") ||
          errString.includes("429") ||
          errString.includes("RESOURCE_EXHAUSTED");

        if (isTemporaryBusy) {
          console.warn(
            `[Gemini] Model ${model} attempt ${attempt + 1} encountered high demand/busy status. Retrying in ${(attempt + 1) * 1200}ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 1200));
          continue;
        }
        // If it's another type of error, fail fast without useless retries
        throw err;
      }
    }
  }
  throw lastError;
}

// Helper to safely parse JSON from Gemini text response
function parseGeminiJson(rawText: string = "{}"): any {
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?\s*```$/, "").trim();
  }
  return JSON.parse(cleaned);
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Endpoint: OCR & Metadata extraction from cover photo or document text
app.post("/api/ocr-extract", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/png", rawText } = req.body;
    const ai = getGenAI();

    let contentsParts: any[] = [];

    if (imageBase64) {
      // Clean base64 string if data URL prefix exists
      const cleanedBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      contentsParts.push({
        inlineData: {
          mimeType,
          data: cleanedBase64,
        },
      });
      contentsParts.push({
        text: `Bạn là một trợ lý thư viện và OCR chuyên nghiệp. Hãy phân tích hình ảnh bìa sách này và trích xuất/dự đoán các thông tin sau bằng tiếng Việt theo định dạng JSON.
Nếu không thấy rõ trường nào, hãy đưa ra suy luận thông minh và phù hợp nhất với tựa sách/hình ảnh.
Trả về JSON với các trường:
- title: Tên cuốn sách
- author: Tên tác giả (hoặc Nhóm tác giả)
- publisher: Nhà xuất bản (dự đoán hoặc trích xuất từ logo/chữ)
- publishYear: Năm xuất bản (vd: 2023)
- pageCount: Số trang ước tính (vd: 320)
- genre: Thể loại sách
- targetAudience: Đối tượng độc giả phù hợp nhất
- keywords: Các từ khóa chính phân cách bằng dấu phẩy
- summaryText: Tóm tắt ngắn gọn 3-4 câu về nội dung chính của sách`,
      });
    } else if (rawText) {
      contentsParts.push({
        text: `Dựa vào đoạn văn bản tóm tắt/nội dung sách dưới đây, hãy trích xuất và bổ sung các thông tin sách phù hợp theo định dạng JSON:
Nội dung: "${rawText}"

Trả về JSON với các trường:
- title: Tên cuốn sách (nếu tìm thấy hoặc ngắn gọn)
- author: Tên tác giả
- publisher: Nhà xuất bản gợi ý
- publishYear: Năm xuất bản
- pageCount: Số trang
- genre: Thể loại
- targetAudience: Đối tượng đọc
- keywords: Từ khóa chính (dấu phẩy)
- summaryText: Tóm tắt nội dung tinh gọn`,
      });
    } else {
      return res.status(400).json({ error: "Vui lòng cung cấp ảnh bìa hoặc văn bản sách." });
    }

    const response = await generateWithFallback((model) => ({
      contents: { parts: contentsParts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            author: { type: Type.STRING },
            publisher: { type: Type.STRING },
            publishYear: { type: Type.STRING },
            pageCount: { type: Type.STRING },
            genre: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            keywords: { type: Type.STRING },
            summaryText: { type: Type.STRING },
          },
          required: ["title", "author", "publisher", "genre", "summaryText"],
        },
      },
    }));

    const data = parseGeminiJson(response.text);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in /api/ocr-extract:", error);
    const errStr = `${error?.message || ""} ${JSON.stringify(error || "")}`;
    let message = error.message || "Không thể phân tích bìa sách.";
    if (errStr.includes("503") || errStr.includes("high demand") || errStr.includes("UNAVAILABLE")) {
      message = "Máy chủ AI đang có lượng yêu cầu cao tạm thời (503). Vui lòng đợi vài giây và thử lại.";
    }
    res.status(500).json({ error: message });
  }
});

// Endpoint: Main Infographic Analysis & Full Media Package Generation
app.post("/api/analyze-and-generate", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/png", metadata, summaryText, libraryConfig } = req.body;
    const ai = getGenAI();

    const parts: any[] = [];

    if (imageBase64) {
      const cleanedBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType,
          data: cleanedBase64,
        },
      });
    }

    const promptText = `
Bạn là một chuyên gia thiết kế đồ họa truyền thông thư viện, biên tập viên xuất bản và chuyên gia marketing sách chuyên nghiệp.
Hãy thực hiện trọn bộ phân tích và tạo nội dung truyền thông Infographic giới thiệu sách cho cuốn sách sau:

THÔNG TIN SÁCH:
- Tên sách: ${metadata?.title || "Sách Chưa Đặt Tên"}
- Tác giả: ${metadata?.author || "Chưa rõ tác giả"}
- Nhà xuất bản: ${metadata?.publisher || "NXB Tổng Hợp"}
- Năm xuất bản: ${metadata?.publishYear || "2024"}
- Số trang: ${metadata?.pageCount || "250"}
- Thể loại: ${metadata?.genre || "Tổng hợp"}
- Đối tượng đọc: ${metadata?.targetAudience || "Bạn đọc đại chúng"}
- Từ khóa: ${metadata?.keywords || "Sách hay, Văn hóa đọc"}
- Tóm tắt nội dung: ${summaryText || "Cuốn sách mang đến nhiều bài học giá trị cho độc giả."}

Nhiệm vụ của bạn:
1. Phân tích màu sắc chủ đạo & cảm xúc bìa sách (Trích xuất các mã HEX thực tế như #1E3A8A, #D97706, #F3F4F6, #111827... phản ánh màu của bìa sách).
2. Phân tích chuyên sâu nội dung (Tạo thông điệp cốt lõi, giá trị mang lại, 4 điểm nổi bật kèm tên icon Lucide thích hợp như BookOpen, Lightbulb, Target, Star, Award, ShieldCheck, Heart, Feather, Compass, TrendingUp, Sparkles, Brain), 3 bài học sâu sắc, 2 câu trích dẫn hay, đối tượng nên đọc, lý do nên đọc.
3. Tạo 3 biến thể phong cách thiết kế (Trang trọng/Academic Formal, Hiện đại/Modern Clean, Sáng tạo/Vibrant Creative) với bảng màu HEX đồng bộ với bìa sách, font style ('sans' | 'serif'), kiểu header ('gradient' | 'minimal' | 'banner' | 'card'), kiểu badge ('pill' | 'square' | 'outline'), và bố cục ('balanced' | 'split-hero' | 'grid-cards').
4. Viết bài giới thiệu sách dạng văn học lôi cuốn truyền cảm hứng (300-500 từ).
5. Đề xuất 10 khẩu hiệu (slogan) truyền thông ấn tượng.
6. Viết 01 Caption Facebook (~250 từ) có icon và lời kêu gọi đọc sách.
7. Viết 01 Bài đăng Zalo ngắn (~150 từ).
8. Viết 01 Bài viết Website chuẩn SEO (~600 từ) có tiêu đề, mở bài, các phần chính và kết luận.
9. Sinh 20 hashtag truyền thông (vd: #SachHay, #VanHoaDoc, #ThuVien...).

Hãy trả về phản hồi dưới dạng đúng chuẩn JSON theo đúng schema sau.`;

    parts.push({ text: promptText });

    const response = await generateWithFallback((model) => ({
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coverAnalysis: {
              type: Type.OBJECT,
              properties: {
                primaryColor: { type: Type.STRING, description: "Mã hex màu chính của bìa sách, vd #1e40af" },
                secondaryColor: { type: Type.STRING, description: "Mã hex màu phụ của bìa, vd #f59e0b" },
                accentColor: { type: Type.STRING, description: "Mã hex màu nhấn, vd #ef4444" },
                backgroundColor: { type: Type.STRING, description: "Mã hex nền phù hợp, vd #f8fafc" },
                textColor: { type: Type.STRING, description: "Mã hex chữ chính, vd #0f172a" },
                styleName: { type: Type.STRING, description: "Phong cách bìa (Hiện đại, Cổ điển, Tối giản...)" },
                mood: { type: Type.STRING, description: "Cảm xúc (Sâu lắng, Trí tuệ, Năng động...)" },
                dominantTopic: { type: Type.STRING, description: "Chủ đề chính" },
                recommendedIcons: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Tên icon Lucide đề xuất",
                },
              },
              required: ["primaryColor", "secondaryColor", "accentColor", "backgroundColor", "textColor", "styleName", "mood"],
            },
            contentAnalysis: {
              type: Type.OBJECT,
              properties: {
                tagline: { type: Type.STRING, description: "Khẩu hiệu hoặc câu giật tít đại diện cho cuốn sách" },
                coreMessage: { type: Type.STRING, description: "Thông điệp cốt lõi" },
                valueProposition: { type: Type.STRING, description: "Giá trị đặc biệt mà cuốn sách mang lại" },
                highlights: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      icon: { type: Type.STRING, description: "Lucide icon name" },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                    required: ["icon", "title", "description"],
                  },
                },
                keyLessons: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                notableQuotes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                targetAudienceDesc: { type: Type.STRING },
                reasonsToRead: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["tagline", "coreMessage", "valueProposition", "highlights", "keyLessons", "notableQuotes", "targetAudienceDesc", "reasonsToRead"],
            },
            variants: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "formal, modern, hoặc vibrant" },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  primaryColor: { type: Type.STRING },
                  secondaryColor: { type: Type.STRING },
                  accentColor: { type: Type.STRING },
                  cardBgColor: { type: Type.STRING },
                  textColor: { type: Type.STRING },
                  subtextColor: { type: Type.STRING },
                  fontFamily: { type: Type.STRING, description: "sans, serif, hoặc mono" },
                  headerStyle: { type: Type.STRING, description: "gradient, minimal, banner, hoặc card" },
                  badgeStyle: { type: Type.STRING, description: "pill, square, hoặc outline" },
                  layoutPattern: { type: Type.STRING, description: "balanced, split-hero, hoặc grid-cards" },
                },
                required: ["id", "name", "description", "primaryColor", "secondaryColor", "accentColor", "cardBgColor", "textColor", "subtextColor", "fontFamily", "headerStyle", "badgeStyle", "layoutPattern"],
              },
            },
            mediaPackage: {
              type: Type.OBJECT,
              properties: {
                bookReviewEssay: { type: Type.STRING, description: "Bài giới thiệu sách 300-500 từ truyền cảm hứng" },
                slogans: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "10 slogan hay về sách"
                },
                facebookCaption: { type: Type.STRING, description: "Caption đăng Facebook ~250 từ kèm emoji và kêu gọi đọc sách" },
                zaloPost: { type: Type.STRING, description: "Bài đăng Zalo ngắn ~150 từ" },
                websiteArticle: { type: Type.STRING, description: "Bài viết chuẩn SEO ~600 từ trình bày Markdown" },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "20 hashtag phù hợp"
                },
              },
              required: ["bookReviewEssay", "slogans", "facebookCaption", "zaloPost", "websiteArticle", "hashtags"],
            },
          },
          required: ["coverAnalysis", "contentAnalysis", "variants", "mediaPackage"],
        },
      },
    }));

    const parsed = parseGeminiJson(response.text);

    res.json({
      success: true,
      data: {
        coverAnalysis: parsed.coverAnalysis,
        contentAnalysis: parsed.contentAnalysis,
        variants: parsed.variants,
        mediaPackage: parsed.mediaPackage,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error in /api/analyze-and-generate:", error);
    const errStr = `${error?.message || ""} ${JSON.stringify(error || "")}`;
    let message = error.message || "Đã xảy ra lỗi khi tạo Infographic bằng AI.";
    if (errStr.includes("503") || errStr.includes("high demand") || errStr.includes("UNAVAILABLE")) {
      message = "Máy chủ AI đang có lượng truy cập tăng đột biến tạm thời (503). Đã tự động thử lại nhưng máy chủ đang bận. Bạn vui lòng bấm nút 'TẠO INFOGRAPHIC NGAY' lại sau vài giây nhé!";
    }
    res.status(500).json({ error: message });
  }
});

// Setup Vite Dev Middleware in non-production, static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BookInfo AI] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
