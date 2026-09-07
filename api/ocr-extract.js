export default async function handler(req, res) {
  // Chỉ chấp nhận phương thức POST từ frontend
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Chỉ hỗ trợ POST request' });
  }

  try {
    // Lấy dữ liệu ảnh và text từ App.tsx gửi lên
    const { imageBase64, rawText } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'Chưa cấu hình GEMINI_API_KEY trên Vercel.' });
    }

    // Xử lý chuỗi ảnh base64 (lọc bỏ phần tiền tố "data:image/..." nếu có)
    let base64Data = imageBase64;
    let mimeType = "image/jpeg"; 
    if (imageBase64 && imageBase64.startsWith("data:")) {
      const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        mimeType = matches[1];
        base64Data = matches[2];
      }
    }

    // Xây dựng payload để gửi sang Google AI Studio
    const contents = [{
      parts: [
        { text: `Phân tích hình ảnh bìa sách và trích xuất các thông tin chi tiết (tên sách, tác giả, nhà xuất bản...). Kết hợp với dữ liệu sau nếu có: ${rawText || ''}` }
      ]
    }];

    if (base64Data) {
      contents[0].parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }

    // Gọi API của Google bằng fetch bản địa (không cần sửa file package.json)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Lỗi xử lý từ Google AI Studio');
    }

    // Trích xuất đoạn text kết quả từ cấu trúc JSON phức tạp của Google
    const extractedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Không tìm thấy thông tin hợp lệ.";

    // Trả về frontend với cấu trúc khớp với { json.success, json.data } ở file App.tsx
    return res.status(200).json({
      success: true,
      data: extractedText
    });

  } catch (error) {
    console.error("Lỗi Serverless Function:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
