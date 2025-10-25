import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { TasksService } from '../tasks/tasks.service';
import { User } from '../users/schemas/user.schema';
import { Project } from '../projects/schemas/project.schema';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const projectsService = app.get(ProjectsService);
  const tasksService = app.get(TasksService);

  try {
    // Check if user already exists
    let user = await usersService.findByEmail('test@example.com');
    
    if (!user) {
      // Create test user
      user = await usersService.create({
        email: 'test@example.com',
        password: 'Test@123',
        name: 'Test User',
      });
      console.log('Test user created');
    } else {
      console.log('Test user already exists');
    }

    // Create projects
    const project1 = await projectsService.create({
      title: 'E-commerce Website',
      description: 'Build a modern e-commerce platform with React and Node.js',
      status: 'active',
    }, (user as any)._id);

    const project2 = await projectsService.create({
      title: 'Mobile App Development',
      description: 'Create a cross-platform mobile application using React Native',
      status: 'active',
    }, (user as any)._id);

    console.log('Projects created');

    // Create tasks for project 1
    await tasksService.create({
      title: 'Design UI/UX',
      description: 'Create wireframes and mockups for the e-commerce website',
      status: 'done',
      dueDate: '2024-01-15',
      projectId: (project1 as any)._id,
    }, (user as any)._id);

    await tasksService.create({
      title: 'Setup Backend API',
      description: 'Implement REST API endpoints for products, users, and orders',
      status: 'in-progress',
      dueDate: '2024-02-01',
      projectId: (project1 as any)._id,
    }, (user as any)._id);

    await tasksService.create({
      title: 'Implement Payment Gateway',
      description: 'Integrate Stripe payment processing',
      status: 'todo',
      dueDate: '2024-02-15',
      projectId: (project1 as any)._id,
    }, (user as any)._id);

    // Create tasks for project 2
    await tasksService.create({
      title: 'Setup Development Environment',
      description: 'Configure React Native development environment',
      status: 'done',
      dueDate: '2024-01-10',
      projectId: (project2 as any)._id,
    }, (user as any)._id);

    await tasksService.create({
      title: 'Implement User Authentication',
      description: 'Add login and registration functionality',
      status: 'in-progress',
      dueDate: '2024-01-25',
      projectId: (project2 as any)._id,
    }, (user as any)._id);

    await tasksService.create({
      title: 'Add Push Notifications',
      description: 'Implement push notification system',
      status: 'todo',
      dueDate: '2024-02-10',
      projectId: (project2 as any)._id,
    }, (user as any)._id);

    console.log(' Tasks created');
    console.log(' Database seeded successfully!');
    console.log('\nTest credentials:');
    console.log('Email: test@example.com');
    console.log('Password: Test@123');

  } catch (error) {
    console.error(' Error seeding database:', error);
  } finally {
    await app.close();
  }
}

seed();
