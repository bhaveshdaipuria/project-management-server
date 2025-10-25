import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    if (!req.user || !req.user._id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.projectsService.create(createProjectDto, req.user._id);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    console.log('Projects Controller - Request received');
    console.log('Projects Controller - Request headers:', req.headers);
    console.log('Projects Controller - Request user:', req.user);
    console.log('Projects Controller - Authorization header:', req.headers.authorization);
    
    if (!req.user || !req.user._id) {
      console.log('Projects Controller - User not authenticated, throwing error');
      throw new UnauthorizedException('User not authenticated');
    }
    
    console.log('Projects Controller - User authenticated, proceeding with request');
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.projectsService.findAll(req.user._id, pageNum, limitNum, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    if (!req.user || !req.user._id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.projectsService.findOne(id, req.user._id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Request() req) {
    if (!req.user || !req.user._id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.projectsService.update(id, updateProjectDto, req.user._id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    if (!req.user || !req.user._id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.projectsService.remove(id, req.user._id);
  }
}




