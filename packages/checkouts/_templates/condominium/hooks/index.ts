import useProducts from './useProducts';
import useResume from './useResume';
import useStep from './useStep';

const index = () => {
    const products = useProducts();
    const resume = useResume();
    return {
        products,
        resume,
    }
}

export default index
export { useProducts, useResume, useStep };
