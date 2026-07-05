import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MarketingService } from './marketing.service';
import {
  CreateSocialAccountDto,
  UpdateSocialAccountDto,
} from './dto/social-account.dto';
import {
  CreateMarketingPostDto,
  UpdateMarketingPostDto,
} from './dto/post.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Get('social-accounts')
  listSocialAccounts() {
    return this.marketingService.listSocialAccounts();
  }

  @Post('social-accounts')
  createSocialAccount(@Body() dto: CreateSocialAccountDto) {
    return this.marketingService.createSocialAccount(dto);
  }

  @Patch('social-accounts/:id')
  updateSocialAccount(@Param('id') id: string, @Body() dto: UpdateSocialAccountDto) {
    return this.marketingService.updateSocialAccount(id, dto);
  }

  @Delete('social-accounts/:id')
  removeSocialAccount(@Param('id') id: string) {
    return this.marketingService.removeSocialAccount(id);
  }

  @Get('posts')
  listPosts() {
    return this.marketingService.listPosts();
  }

  @Post('posts')
  createPost(@Body() dto: CreateMarketingPostDto) {
    return this.marketingService.createPost(dto);
  }

  @Patch('posts/:id')
  updatePost(@Param('id') id: string, @Body() dto: UpdateMarketingPostDto) {
    return this.marketingService.updatePost(id, dto);
  }

  @Delete('posts/:id')
  removePost(@Param('id') id: string) {
    return this.marketingService.removePost(id);
  }
}
