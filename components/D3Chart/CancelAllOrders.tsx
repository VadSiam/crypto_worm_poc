import { Button } from "@mui/material"
import { cancelAllOpenOrders } from "../../utils/endpoints"

interface ICancelAllOpenOrders {
  setOrders: React.Dispatch<React.SetStateAction<string[]>>
}

const CancelAllOpenOrders = ({
  setOrders,
}: ICancelAllOpenOrders) => {
  const onCancelAllOrders = async () => {
    try {
      await cancelAllOpenOrders('BTCUSDT')
      setOrders([])
    } catch (error) {
      console.error('Error in cancelAllOpenOrders:', error)
    }
  }

  return (
    <Button
      onClick={onCancelAllOrders}
    >Cancel All Open Orders
    </Button>
  )
}

export { CancelAllOpenOrders }