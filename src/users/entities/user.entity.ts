import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column({unique:true})
    username:string;

    @Column({unique:true})
    email:string;

    @Column()
    password:string;

    @BeforeInsert()
    emailToLowercase(){
        this.email=this.email.toLocaleLowerCase();
    }
}
