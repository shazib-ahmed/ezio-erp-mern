declare module 'react-infinite-scroll-component' {
  import * as React from 'react';

  export interface Props {
    dataLength: number;
    next: () => any;
    hasMore: boolean;
    loader: React.ReactNode;
    scrollThreshold?: number | string;
    onScroll?: (e: MouseEvent) => any;
    endMessage?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    height?: number | string;
    scrollableTarget?: React.ReactNode | string;
    hasChildren?: boolean;
    inverse?: boolean;
    pullDownToRefresh?: boolean;
    pullDownToRefreshContent?: React.ReactNode;
    releaseToRefreshContent?: React.ReactNode;
    pullDownToRefreshThreshold?: number;
    refreshFunction?: () => any;
    initialScrollY?: number;
    children?: React.ReactNode;
  }

  export default class InfiniteScroll extends React.Component<Props, any> {}
}
