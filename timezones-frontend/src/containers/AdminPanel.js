import {
    useState,
    useEffect
} from 'react';
import { useNavigate } from 'react-router-dom';

import AdminPanelComponent from '../components/AdminPanel';
import sendHttpRequest from '../utils/sendHttpRequest';

const AdminPanelContainer = () => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ currentlyEditedFoodId, setCurrentlyEditedFoodId ] = useState(false);
    const [ allFoodsList, setAllFoodsList ] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllFoodsList();
    }, []);

    const getAllFoodsList = async () => {
        setIsLoading(true);

        try {
            const response = await sendHttpRequest({
                endpoint: '/foods/admin/all',
            }, navigate);

            setAllFoodsList(response);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const addNewFood = async event => {
        event.preventDefault();

        setIsLoading(true);

        const {
            name: nameElement,
            consumedAt: consumedAtElement,
            kcal: kcalElement,
            price: priceElement,
            username: usernameElement,
        } = event.target.elements;

        const formattedConsumptionDate = (new Date(consumedAtElement.value)).getTime();

        try {
            const response = await sendHttpRequest({
                method: 'POST',
                endpoint: '/foods/admin',
                data: {
                    name: nameElement.value,
                    consumedAt: formattedConsumptionDate,
                    kcal: kcalElement.value,
                    price: priceElement.value,
                    username: usernameElement.value,
                }
            }, navigate);
            console.log(response)
            getAllFoodsList();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const updateFood = async updatedFood => {
        setIsLoading(true);

        try {
            await sendHttpRequest({
                method: 'PATCH',
                endpoint: '/foods/admin',
                data: updatedFood,
            }, navigate);

            getAllFoodsList();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const deleteFood = async id => {
        setIsLoading(true);

        try {
            await sendHttpRequest({
                method: 'DELETE',
                endpoint: '/foods/admin',
                urlParams: {
                    id
                }
            }, navigate);

            getAllFoodsList();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AdminPanelComponent
            isLoading={isLoading}
            currentlyEditedFoodId={currentlyEditedFoodId}
            foodsList={allFoodsList}
            addNewFood={addNewFood}
            deleteFood={deleteFood}
            editFood={id => setCurrentlyEditedFoodId(id)}
            submitFoodChanges={updatedFood => {
                updateFood(updatedFood);
                setCurrentlyEditedFoodId(null);
            }}
            discardFoodChanges={() => setCurrentlyEditedFoodId(null)}
        />
    );
}

export default AdminPanelContainer;