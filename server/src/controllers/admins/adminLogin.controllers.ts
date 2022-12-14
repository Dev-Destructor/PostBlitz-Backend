import { Request, Response } from "express";
import { IAdmin } from "../../utils/typings";
import { IsValidUser } from "../../middleware/passHashing";
import { refreshAdminToken } from "../../middleware/token";
import { Admin } from "../../models/admin.model";
import { randomBytes } from "crypto";
import { serverError } from "../../utils/errorHandler";

/**
 * @description This service is used to login admin. It will check if the user exists or not. If the user exists then it will check if the password is correct or not. If the password is correct then it will generate a new token and send it to the user.
 */

export const loginAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;
    const sessionId = req.cookies.sessionId;

    if (sessionId) {
      return res.status(302).json({ message: "Token Already Exist" });
    }

    const newSessionId = randomBytes(16).toString("hex");

    const findAdmin: IAdmin | null = await Admin.findOneAndUpdate(
      { username: username },
      {
        sessionId: newSessionId,
        updated_At: Date.now(),
      }
    );
    if (findAdmin === null) {
      return res.status(404).json({ message: "user does not exist" });
    }
    const userPassword = findAdmin.password.toString();

    const result = await IsValidUser(password, userPassword);
    if (result === false) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const refreshToken = refreshAdminToken(findAdmin);

    res
      .cookie("sessionId", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      })
      .status(201)
      .json({
        message: "Logged In Successfully",
      });
  } catch (error: any) {
    serverError(error, res);
  }
};
