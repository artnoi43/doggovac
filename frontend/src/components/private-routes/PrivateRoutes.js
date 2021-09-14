import { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { authContext } from '../../App';
import RoutesConfig from '../../config/routes';

function PrivateRoutes() {

    const { role } = useContext(authContext);

    const allowedRoutes = RoutesConfig[role].allowedRoutes;
    const redirectRoute = RoutesConfig[role].redirectRoute;

    return (
        <Switch>
            {allowedRoutes.map(route => {
                return <Route key={route.url} exact path={route.url} component={route.component} />
            })}
            <Redirect to={redirectRoute} />
        </Switch>
    );
};

export default PrivateRoutes;
