import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query 
} from '@nestjs/common';
import { IndustryService } from './industry.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { Public } from '@/common/decorators/public.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';

@Controller('industries')
export class IndustryController {
  constructor(private readonly industryService: IndustryService) {}

  @Post()
  @Permissions('INDUSTRY_MANAGE')
  create(@Body() createIndustryDto: CreateIndustryDto) {
    return this.industryService.create(createIndustryDto);
  }

  @Get()
  @Public()
  findAll(
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string
  ) {
    return this.industryService.findAll(
      limit ? Number(limit) : 10,
      cursor ? Number(cursor) : undefined
    );
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.industryService.findOne(Number(id));
  }

  @Patch(':id')
  @Permissions('INDUSTRY_MANAGE')
  update(@Param('id') id: string, @Body() updateIndustryDto: UpdateIndustryDto) {
    return this.industryService.update(Number(id), updateIndustryDto);
  }

  @Delete(':id')
  @Permissions('INDUSTRY_MANAGE')
  remove(@Param('id') id: string) {
    return this.industryService.remove(Number(id));
  }
}
