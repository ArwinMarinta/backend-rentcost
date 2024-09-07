import { Auth } from '../../app/auths/entities/auth.entity';
import { User } from '../../app/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';

export default class AuthSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query('DELETE FROM auth;');
    const repository = dataSource.getRepository(Auth);
    const newAuth = await repository.insert({
      email: 'samanmuhammad077@gmail.com',
      password: await bcrypt.hash('123456', 10),
      is_verified: true,
    });
    console.log(newAuth);
    const userRepository = dataSource.getRepository(User);

    await userRepository.insert({
      username: 'Murniasi Saman',
      phone_number: '+62821586212',
      location: 'Balikpapan',
      identify_type: 'KTP',
      identity_number: '2121331212',
      bank_account: '3233627362323',
      image_url: 'https://randomuser.me/api/portraits/men/1.jpg',
      created_at: new Date(),
      auth: newAuth.identifiers[0].id,
    });
  }
}
