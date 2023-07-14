import { Button } from "@mui/material"
import { cancelAllOpenOrders } from "../../utils/endpoints"

const CancelAllOpenOrders = () => {
  const onCancelAllOrders = async () => {
    await cancelAllOpenOrders('BTCUSDT')
    // await cancelAllOpenOrdersOneByOne('BTCUSDT')
  }

  return (
    <Button
      onClick={onCancelAllOrders}
    >Cancel All Open Orders
    </Button>
  )
}

export { CancelAllOpenOrders }