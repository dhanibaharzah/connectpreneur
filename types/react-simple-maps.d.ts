/* Minimal typings — package ships without types */
declare module "react-simple-maps" {
  import type { CSSProperties, ReactNode } from "react"

  export interface ComposableMapProps {
    width?: number
    height?: number
    projection?: string | unknown
    projectionConfig?: Record<string, unknown>
    className?: string
    style?: CSSProperties
    preserveAspectRatio?: string
    children?: ReactNode
  }

  export const ComposableMap: import("react").ForwardRefExoticComponent<
    ComposableMapProps & import("react").RefAttributes<SVGSVGElement>
  >

  export interface RsmGeography {
    rsmKey: string
    svgPath: string
    properties: Record<string, unknown>
    geometry?: unknown
  }

  export interface GeographiesProps {
    geography: string | object
    children: (props: { geographies: RsmGeography[] }) => ReactNode
    parseGeographies?: (features: unknown[]) => unknown[]
  }

  export const Geographies: import("react").ForwardRefExoticComponent<
    GeographiesProps & import("react").RefAttributes<SVGSVGElement>
  >

  export interface GeographyProps {
    geography: RsmGeography
    children?: ReactNode
    style?: Record<string, CSSProperties | Record<string, string | number>>
    onMouseEnter?: () => void
    onMouseLeave?: () => void
  }

  export const Geography: import("react").ForwardRefExoticComponent<
    GeographyProps & import("react").RefAttributes<SVGPathElement>
  >
}
