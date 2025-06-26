import { Contact } from 'src/contacts/entities/contact.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  owner_id: number;

  @Column({ nullable: true })
  primary_contact_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id', referencedColumnName: 'id' })
  owner: User;

  @ManyToOne(() => Contact)
  @JoinColumn({ name: 'primary_contact_id', referencedColumnName: 'id' })
  primaryContact: Contact;
}
