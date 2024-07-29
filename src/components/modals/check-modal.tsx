import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog"
import { onClose } from "@/redux/modals/modalSlice";


export const CheckModal = () => {
    const dispatch = useDispatch()
    const { isOpen } = useSelector((state: any)=> state.modal)


    return (
      <Dialog open={isOpen} onOpenChange={()=>dispatch(onClose())} >
        <DialogContent className="">
          <DialogTitle>Check Modal</DialogTitle>
          <DialogDescription>This is a check modal.</DialogDescription>
        </DialogContent>
      </Dialog>
    );
} 