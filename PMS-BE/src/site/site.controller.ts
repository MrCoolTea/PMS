import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SiteService } from './site.service';
import { UpdateSiteContentDto, UpdateSiteSettingsDto } from './dto/site-content.dto';

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get('public')
  getPublicData() {
    return this.siteService.getPublicData();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('dashboard')
  getDashboardData() {
    return this.siteService.getDashboardData();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('settings')
  getSettings() {
    return this.siteService.getSettings();
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('settings')
  updateSettings(@Body() dto: UpdateSiteSettingsDto) {
    return this.siteService.updateSettings(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('content')
  getContent() {
    return this.siteService.getContent();
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('content')
  updateContent(@Body() dto: UpdateSiteContentDto) {
    return this.siteService.updateContent(dto);
  }
}
