import { useGetAllProductsQuery, useGetProductQuery } from "@/api/api-slice";

export const Authentication = () => {
    const { data: products, isError, isLoading } = useGetAllProductsQuery({});
    const { data:product } = useGetProductQuery("iphone")

    console.log(products)
    console.log(product)

    if(isLoading) return <div>Loading...</div>

    return (
        <div>
            Auth
        </div>
    )
}