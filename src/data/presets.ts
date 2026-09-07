import { BookMetadata } from '../types';

export interface BookPreset {
  id: string;
  name: string;
  metadata: BookMetadata;
  summaryText: string;
  coverPlaceholderUrl?: string;
  coverBgGradient: string;
}

export const BOOK_PRESETS: BookPreset[] = [
  {
    id: 'dante',
    name: 'Đắc Nhân Tâm (Dale Carnegie)',
    metadata: {
      title: 'Đắc Nhân Tâm',
      author: 'Dale Carnegie',
      publisher: 'NXB Tổng Hợp TPHCM',
      publishYear: '2023',
      pageCount: '320',
      genre: 'Kỹ năng sống / Phát triển bản thân',
      targetAudience: 'Mọi lứa tuổi, sinh viên, cán bộ, người quản lý',
      keywords: 'Giao tiếp, Thu phục lòng người, Thấu hiểu, Thành công',
      qrUrl: 'https://thuvien.hcvp.edu.vn/dac-nhan-tam'
    },
    summaryText: 'Đắc Nhân Tâm (How to Win Friends and Influence People) là cuốn sách nổi tiếng nhất thế giới về nghệ thuật ứng xử và giao tiếp. Tác phẩm đưa ra những nguyên tắc vàng trong việc thấu hiểu con người, tạo thiện cảm, thuyết phục người khác và lãnh đạo mà không gây phản cảm. Những bài học trong sách vượt thời gian, giúp xây dựng mối quan hệ bền vững trong công việc và cuộc sống.',
    coverBgGradient: 'from-amber-700 via-orange-800 to-amber-950'
  },
  {
    id: 'ho-chi-minh',
    name: 'Hồ Chí Minh – Hành Trình Tìm Đường Cứu Nước',
    metadata: {
      title: 'Hồ Chí Minh – Hành Trình Tìm Đường Cứu Nước',
      author: 'Nhiều Tác Giả / Viện Lịch Sử Đảng',
      publisher: 'NXB Chính Trị Quốc Gia Sự Thật',
      publishYear: '2022',
      pageCount: '450',
      genre: 'Lịch sử / Chính trị / Lãnh tụ',
      targetAudience: 'Cán bộ, chiến sĩ, giáo viên, học sinh sinh viên',
      keywords: 'Hồ Chí Minh, Cách mạng, Lịch sử Việt Nam, Tư tưởng Hồ Chí Minh',
      qrUrl: 'https://thuvien.hcvp.edu.vn/ho-chi-minh-hanh-trinh'
    },
    summaryText: 'Cuốn sách tái hiện chặng đường gian khổ nhưng vĩ đại của Chủ tịch Hồ Chí Minh từ khi rời bến cảng Nhà Rồng năm 1911 qua 30 năm bôn ba khắp 5 châu 4 biển để tìm ra con đường giải phóng dân tộc. Cuốn sách giúp người đọc thấu hiểu sâu sắc tư tưởng, đạo đức, phong cách Hồ Chí Minh và ngọn lửa yêu nước nồng nàn.',
    coverBgGradient: 'from-red-800 via-rose-900 to-red-950'
  },
  {
    id: 'nha-gia-kim',
    name: 'Nhà Giả Kim (Paulo Coelho)',
    metadata: {
      title: 'Nhà Giả Kim',
      author: 'Paulo Coelho',
      publisher: 'NXB Hội Nhà Văn',
      publishYear: '2021',
      pageCount: '228',
      genre: 'Tiểu thuyết / Văn học thế giới',
      targetAudience: 'Bạn đọc yêu văn học, người trẻ đang tìm kiếm ước mơ',
      keywords: 'Ước mơ, Vận mệnh, Hành trình, Trái tim, Bản ngã',
      qrUrl: 'https://thuvien.hcvp.edu.vn/nha-gia-kim'
    },
    summaryText: 'Nhà Giả Kim kể về chuyến hành trình của Santiago - một cậu bé chăn cừu người Tây Ban Nha - đi tìm kho báu tại Kim Tự Tháp Ai Cập. Qua những biến cố và gặp gỡ duyên số, cậu nhận ra kho báu lớn nhất chính là sự lắng nghe tiếng nói trái tim và dám kiên trì theo đuổi ước mơ của đời mình.',
    coverBgGradient: 'from-blue-900 via-indigo-950 to-slate-900'
  }
];
