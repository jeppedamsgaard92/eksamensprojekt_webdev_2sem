import { deleteCourseById, findCourseById } from "../dataUtils/onboarding.js";
import { deleteSurveyById, findAnsweredSurveyById } from "../dataUtils/surveys.js";
import { deleteUserById, findUserById, getAllUsers } from "../dataUtils/users.js";
import { auditLog } from "../utils/auditLogger.js";

export async function getAllClients(req, res) {
    try {
        const allUsers = await getAllUsers();

        const clientUsers = allUsers.filter(user => {
            return user.role === 'client';
        });

        if (clientUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kunne ikke finde nogle oprettede klienter'
            })
        }

        const allClientsWithAllDataPromises = clientUsers.map(async (user) => {
            const onboarding = await findCourseById(user.id);
            const answeredSurvey = await findAnsweredSurveyById(user.id);

            return {
                clientId: user.id,
                role: user.role,
                clientName: user.name,
                surveyAnswers: answeredSurvey ? answeredSurvey.survey : null,
                onboardingSlides: onboarding ? onboarding.onboardingSlides : null
            }
        });

        const allClientsWithAllData = await Promise.all(allClientsWithAllDataPromises);

        res.status(200).json(allClientsWithAllData);

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Der skete en intern serverfejl. Kunne ikke fetche klienter'
        });
    }
}

export async function getSpecificClient(req, res) {
    try {
        const { clientId } = req.params;

        const user = await findUserById(clientId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Brugeren findes ikke.'
            })
        }

        if (user.role !== 'client') {
            return res.status(404).json({
                success: false,
                message: 'Den efterspurgte bruger er ikke registreret som klient'
            })
        }

        const onboarding = await findCourseById(clientId);
        const answeredSurvey = await findAnsweredSurveyById(clientId);

        const clientWithData = {
            clientId: user.id,
            role: user.role,
            clientName: user.name,
            surveyAnswers: answeredSurvey ? answeredSurvey.survey : null,
            onboardingSlides: onboarding ? onboarding.onboardingSlides : null
        }

        res.status(200).json(clientWithData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Der skete en intern serverfejl. Kunne ikke fetche klient'
        });
    }
}

export async function deleteUser(req, res) {
    try {
        const { userId } = req.params;

        const userWasDeleted = await deleteUserById(userId);

        if (userWasDeleted) {
            const usersSurveyWasDeleted = await deleteSurveyById(userId);
            const courseWasDeleted = await deleteCourseById(userId);

            await auditLog({
                action: "DELETE_USER",
                actorUserId: req.session.user.id,
                targetUserId: userId,
            });
            return res.status(200).json({
                success: true,
                message: `Brugeren blev slettet fra serveren. ${usersSurveyWasDeleted ? 'Brugerens survey blev slettet' : ''}${courseWasDeleted ? 'Brugerens onboarding blev slettet.' : ''}`
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