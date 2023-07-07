import { Button } from "@mui/material"
import { cancelAllOpenOrdersOneByOne } from "../../utils/endpoints"

const CancelAllOpenOrders = () => {
  const onCancelAllOrders = async () => {
    await cancelAllOpenOrdersOneByOne('BTCUSDT')
  }

  return (
    <Button
    onClick={onCancelAllOrders}
    >Cancel All Open Orders
    </Button>
  )
}

export { CancelAllOpenOrders }