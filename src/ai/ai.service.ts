import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, Content } from '@google/generative-ai';

export type ChatHistoryItem = { role: 'user' | 'model'; text: string };

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey as string);
  }

  async chat(
    message: string,
    history: ChatHistoryItem[] = [],
  ): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      // gemini-1.5-flash đã ngừng hỗ trợ; model này đã được xác minh với API key hiện tại.
      model: 'gemini-3.5-flash-lite',
      systemInstruction:
        'Bạn là nhân viên bán hàng của ShopAI. Chỉ tư vấn về đồ công nghệ. Trả lời cực ngắn dưới 30 chữ. Không nói chuyện chính trị.',
    });

    // Đổi { role, text } từ Mobile thành định dạng Gemini Content[]
    const geminiHistory: Content[] = history.slice(-10).map((h) => ({
      role: h.role,
      parts: [{ text: h.text }],
    }));

    try {
      const chat = model.startChat({ history: geminiHistory });
      const result = await chat.sendMessage(message);
      const response = result.response;
      const reply = response.text().trim();

      if (!reply) {
        throw new Error('Gemini trả về phản hồi rỗng');
      }

      return reply;
    } catch (error) {
      // Ghi chi tiết ở Server, nhưng không trả thông tin provider/API key về Mobile.
      this.logger.error(
        'Gemini request failed',
        error instanceof Error ? error.stack : error,
      );
      throw new ServiceUnavailableException(
        'Trợ lý AI đang tạm thời không khả dụng. Vui lòng thử lại sau.',
      );
    }
  }
}
