package controllers;

import models.ResultSet;
import models.User;
import models.utils.AppException;
import play.Logger;
import play.data.Form;
import play.data.validation.Constraints;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Security;
import views.html.dashboard;
import views.html.index;
import views.html.login;
import views.html.resultset;

import java.io.File;
import java.io.IOException;

import static play.data.Form.form;

public class Application extends Controller {

    public static Result GO_DASHBOARD = redirect(
            controllers.routes.Application.dashboard()
    );

    public static Result index() {
        User loggedInUser = User.findByEmail(session().get("email"));
        return ok(index.render(loggedInUser, ResultSet.all()));
    }

    public static Result logout() {
        session().clear();
        return ok(index.render(null, ResultSet.all()));
    }

    public static Result login() {
        return ok(login.render(form(Login.class)));
    }

    @Security.Authenticated(Secured.class)
    public static Result dashboard() {
        User loggedInUser = User.findByEmail(request().username());
        return ok(dashboard.render(loggedInUser, false, null, ResultSet.all()));
    }

    @Security.Authenticated(Secured.class)
    public static Result upload() throws IOException {
        User loggedInUser = User.findByEmail(request().username());
        Http.MultipartFormData body = request().body().asMultipartFormData();
        Http.MultipartFormData.FilePart resultSet = body.getFile("file");
        String[] name = body.asFormUrlEncoded().get("name");
        String[] desc = body.asFormUrlEncoded().get("desc");
        String description = "No description";
        if (name.length < 1 || name[0].isEmpty() || name[0].equalsIgnoreCase(" ")) {
            return badRequest(dashboard.render(loggedInUser, true, "Empty or blank name.", ResultSet.all()));
        }

        if (ResultSet.findByName(name[0]) != null) {
            return badRequest(dashboard.render(loggedInUser, true, "Result set with same name exists.", ResultSet.all()));
        }

        if (desc.length >= 1) {
            description = desc[0];
        }

        if (resultSet != null) {
            File file = resultSet.getFile();
            Logger.info(String.format("User %s uploaded a new result of name %s", loggedInUser.id, name[0]));
            ResultSet.createFromFile(name[0], description, loggedInUser, file);
            return GO_DASHBOARD;
        } else {
            return badRequest(dashboard.render(loggedInUser, true, "Missing file.", ResultSet.all()));
        }
    }

    public static Result visualize(Long resultSetId){
        User loggedInUser = User.findByEmail(request().username());
        ResultSet r = ResultSet.findById(resultSetId);

        return ok(resultset.render(loggedInUser, r));
    }

    public static Result uploadGet() {
        return redirect(controllers.routes.Application.dashboard());
    }

    public static Result authenticateGet() {
        return redirect(controllers.routes.Application.login());
    }

    /**
     * Handle login form submission.
     *
     * @return Dashboard if auth OK or login form if auth KO
     */
    public static Result authenticate() {
        Form<Login> loginForm = form(Login.class).bindFromRequest();

        if (loginForm.hasErrors()) {
            return badRequest(login.render(loginForm));
        } else {
            session("email", loginForm.get().email);
            return GO_DASHBOARD;
        }
    }


    /**
     * Login class used by Login Form.
     */
    public static class Login {

        @Constraints.Required
        public String email;

        @Constraints.Required
        public String password;

        /**
         * Validate the authentication.
         *
         * @return null if validation ok, string with details otherwise
         */
        public String validate() {

            User user = null;
            try {
                user = User.authenticate(email, password);
            } catch (AppException e) {
                Logger.error("Something went wrong during authentication.", e);
                return "Technical error, please retry later.";
            }

            if (user == null) {
                String errMessage = "Invalid user or password.";
                Logger.warn(errMessage);
                return errMessage;
            }

            return null;
        }

    }
}
