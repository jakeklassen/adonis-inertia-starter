import { UserDto } from '#dtos/user_dto';
import type { HttpContext } from '@adonisjs/core/http';

export default class ProfilesController {
  /**
   * Show the user's profile with linked accounts
   */
  async show({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail();

    return inertia.render('profile', {
      user: new UserDto(user).toJson(),
    });
  }
}
