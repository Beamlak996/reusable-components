import { Button } from "@/components/ui/button"
import { useDispatch } from "react-redux"
import { onOpen } from "@/redux/modals/modalSlice"

export const AllApps = () => {
    const dispatch = useDispatch()

    return (
        <div>
            <Button onClick={()=>dispatch(onOpen())}>Click</Button>
        </div>
    )
}