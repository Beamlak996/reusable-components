import { useParams } from "react-router-dom"

export const Analytics = () => {
    const { aId } = useParams()

    return (
        <div>
            Analytics / {aId}
        </div>
    )
}