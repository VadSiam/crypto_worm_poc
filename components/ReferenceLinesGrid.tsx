import { useCallback, useState } from "react"
import { ReferenceLine, ReferenceLineProps } from "recharts"

interface IReferenceLine extends ReferenceLineProps {
  ticks: number[]
  orders: number[]
  clickOn: (arg: number) => void
}

const ReferenceLinesGrid = ({ ticks, clickOn, orders, ...props }: IReferenceLine) => {
  const [onFocus, setOnFocus] = useState<number>(0)
  const onMouse = useCallback((num: number) => {
    setOnFocus(num);
  }, [setOnFocus])
  const offMouse = useCallback(() => {
    setOnFocus(0);
  }, [setOnFocus])

  return (
    <>
      {ticks.map((tick) => {
        const inOrder = orders.includes(tick)
        return (
          <ReferenceLine
            {...props}
            id={`${tick}`}
            key={tick}
            strokeWidth={10}
            y={tick}
            stroke={inOrder
              ? 'blue'
              : onFocus === tick ? "#99f39980" : "#f8cece"}
            fillOpacity={0.1}
            isFront={false}
            label={`${tick}`}
            onClick={() => clickOn(tick)}
            onMouseEnter={() => onMouse(tick)}
            onMouseLeave={() => offMouse()}
          />
        )
      })}
    </>
  )
}

ReferenceLinesGrid.displayName = ReferenceLine.displayName;
ReferenceLinesGrid.defaultProps = ReferenceLine.defaultProps;

export default ReferenceLinesGrid;