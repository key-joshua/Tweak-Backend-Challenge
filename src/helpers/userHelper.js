import UserSchema from '../models/user';
import passwordHelper from './passwordHelper';

/**
* This class contains all methods (functions) required to handle
* userExist function.
* saveUser function.
* verifyAccount function.
* save a new user into database and return created user.
*/
class UserHelper {
  /**
   * Check a user into users table in database.
   * @param {string} attribute table column.
   * @param {string} value user details.
   * @returns {object} exist user.
   */
  static async userExist(attribute, value) {
    const data = await UserSchema.findOne({ [attribute]: value });
    return data;
  }

  /**
   * Save a user into users table in database.
   * @param {object} body user details.
   * @returns {object} saved user details.
   */
  static async saveUser(body) {
    const data = await UserSchema.create({
      profile: null,
      userName: body.userName,
      email: body.email,
      isVerified: false,
      password: passwordHelper.hashPassword(body.password),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return data;
  }

  /**
   * Update profile into users table in database.
   * @param {string} existUser user existing details.
   * @param {string} image user profile picture.
   * @returns {object} updated user details.
   */
  static async updateProfile(existUser, image) {
    let data = await UserSchema.updateOne({ _id: existUser.id },
      {
        $set: {
          profile: image || existUser.profile
        }
      }
    );

    if (data.ok === 1) {
      data = await this.userExist('_id', existUser.id);
      return data;
    }

    return null;
  }

  /**
   * verify user profile into users table in database.
   * @param {string} id table attribute.
   * @param {string} status account status.
   * @returns {object} updated user details.
   */
  static async verifyUserProfile(id, status) {
    let data = await UserSchema.updateOne({ _id: id },
      {
        $set: {
          isVerified: status
        }
      }
    );

    if (data.ok === 1) {
      data = await this.userExist('_id', id);
      return data;
    }

    return null;
  }

  /**
   * remove User.
   * @param {string} id a user id.
   * @returns {string} a destroyed session.
   */
  static async removeUser(id) {
    const data = await UserSchema.deleteOne({ _id: id });
    return data;
  }
}

export default UserHelper;
