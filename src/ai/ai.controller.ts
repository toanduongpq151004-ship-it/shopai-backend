import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatDto } from './dto/chat.dto.js';
import { AiService } from './ai.service.js';

@Controller('api/ai')
@ApiTags('Ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() body: ChatDto) {
    const reply = await this.aiService.chat(body.message, body.history ?? []);
    return { reply };
  }
}
