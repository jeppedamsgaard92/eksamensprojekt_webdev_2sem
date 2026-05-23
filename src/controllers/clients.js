import { deleteUserById } from "../dataUtils/users.js";

export async function deleteUser(req, res) {
    try {
        const { userId } = req.params;

        const userWasDeleted = await deleteUserById(userId);

        if (userWasDeleted) {
            return res.status(200).json({
                success: true,
                message: 'Brugeren blev slettet fra serveren'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Kunne ikke slette: Brugeren blev ikke fundet'
            });
        }
    } catch (error) {
        console.error("Fejl under sletning af bruger:", error);
        return res.status(500).json({
            success: false,
            message: 'Der skete en intern serverfejl under sletningen'
        });
    }
}