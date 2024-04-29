import { Module } from "@nestjs/common";
import { AuthModule } from "./user/auth/auth.module";


@Module({
  imports: [AuthModule],
})
export class AppModule {}
