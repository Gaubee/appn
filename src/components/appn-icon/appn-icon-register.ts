import type {Properties, SvgProperties} from 'csstype';

export interface AppnIcon {
  viewBox: AppnIcon.ViewBox;
  layers: AppnIcon.Layer[];
  variants?: AppnIcon.Variant[];
}
export namespace AppnIcon {
  export interface ViewBox {
    minX: number;
    minY: number;
    width: number;
    height: number;
  }

  interface BaseLayer<T extends string> extends Pick<SvgProperties, 'fill' | 'fillOpacity'> {
    type: T;
  }
  export interface PathLayer extends BaseLayer<'path'> {
    d: string;
  }
  export interface PolylineLayer extends BaseLayer<'polyline'> {
    points: string;
  }
  export interface RectLayer extends BaseLayer<'rect'> {
    /** The x position of the top left corner of the rectangle. */
    x: number;
    /** The y position of the top left corner of the rectangle. */
    y: number;
    /** The width of the rectangle. */
    width: number;
    /** The height of the rectangle. */
    height: number;
    /** The x radius of the corners of the rectangle. */
    rx: number;
    /** The y radius of the corners of the rectangle. */
    ry: number;
  }
  export interface CircleLayer extends BaseLayer<'circle'> {
    /** The radius of the circle.*/
    r: number;
    /** The x position of the center of the circle.*/
    cx: number;
    /** The y position of the center of the circle.*/
    cy: number;
  }
  export interface EllipseLayer extends BaseLayer<'ellipse'> {
    /** The x radius of the ellipse.*/
    rx: number;
    /** The y radius of the ellipse.*/
    ry: number;
    /** The x position of the center of the ellipse.*/
    cx: number;
    /** The y position of the center of the ellipse.*/
    cy: number;
  }

  export interface AppnIconBase {
    viewBox: AppnIcon.ViewBox;
    layers: AppnIcon.Layer[];
  }

  export type Layer = PathLayer | PolylineLayer | RectLayer;

  interface VariantBase<T extends string> {
    type: T;
    selector: string;
  }
  export interface VariantStyle extends VariantBase<'style'> {
    style: Properties;
  }
  export interface VariantIcon extends VariantBase<'icon'> {
    viewBox: AppnIcon.ViewBox;
    layers: AppnIcon.Layer[];
  }
  export type Variant = VariantStyle | VariantIcon;
}

const icons = new Map<string, AppnIcon>();
const events = new EventTarget();
export const appnIconDefine = (name: string, icon: AppnIcon) => {
  if (icons.has(name)) {
    throw new Error(`icon ${name} already defined`);
  }
  icons.set(name, icon);
  events.dispatchEvent(new AppnIconDefineEvent(name, icon));
};
export const appnIconGet = (name: string) => {
  return icons.get(name);
};
export const appnIconWhenDefine = (name: string, hook: (detail: AppnIconDefineEvent['detail']) => void) => {
  events.addEventListener(
    'appn-icon-define-' + name,
    (event) => {
      hook((event as AppnIconDefineEvent).detail);
    },
    {once: true}
  );
};

class AppnIconDefineEvent extends CustomEvent<{name: string; icon: AppnIcon}> {
  constructor(name: string, icon: AppnIcon) {
    super('appn-icon-define-' + name, {
      detail: {
        name,
        icon,
      },
    });
  }
}

export const appnIconSafeGet = async (name: string): Promise<AppnIcon> => {
  let icon = appnIconGet(name);
  if (icon == null) {
    icon = await new Promise<AppnIcon>((resolve) => {
      appnIconWhenDefine(name, ({icon}) => {
        resolve(icon);
      });
    });
  }
  return icon;
};
