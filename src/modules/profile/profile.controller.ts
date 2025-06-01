import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserTokenInfo } from "src/decorators/user-info.decorator";
import { JwtPayload } from "src/interfaces/user-info.interface";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfileService } from "./profile.service";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @HttpCode(200)
  getProfile(@UserTokenInfo() userInfo: JwtPayload) {
    return this.profileService.getProfile(userInfo.email);
  }

  @Get("profile-image")
  @HttpCode(200)
  getProfileImage(@UserTokenInfo() userInfo: JwtPayload) {
    return this.profileService.getProfileImage(userInfo.email);
  }

  @Put()
  updateProfile(
    @UserTokenInfo() userInfo: JwtPayload,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.profileService.updateProfile(userInfo.id, updateProfileDto);
  }

  @Put("profile-image")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 7 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/heic",
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException("Formato de arquivo inválido."), false);
        }
      },
    })
  )
  updateProfileImage(
    @UserTokenInfo() userInfo: JwtPayload,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.profileService.updateProfileImage(userInfo.id, file);
  }

  @Get("third-person-profile")
  getThirdPersonProfile(@Query('username') username: string) {
    if (!username) {
      throw new BadRequestException("Email do usuário não fornecido.");
    }
    return this.profileService.getProfile(decodeURIComponent(username));
  }
}
