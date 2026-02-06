import { Navigate, useParams } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { FormMutationAccountPage } from './components/FormMutationAccountPage';

export default function UpdateUserPage() {
    const { id } = useParams();
    if (!id) {
        return <Navigate to={RouteConfig.ListUserPage.path} />;
    }
    return <FormMutationAccountPage _id={id} />;
}
