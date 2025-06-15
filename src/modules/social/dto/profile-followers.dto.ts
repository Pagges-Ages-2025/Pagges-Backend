class ProfileFollowersDto {
  user_id: number;
  profile_image: string | null;
  username: string;
  imFollowing: boolean;
}

export class ProfileFollowersResponseDto {
  followers: ProfileFollowersDto[];
}
