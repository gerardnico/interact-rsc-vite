/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export type FallBackProps = {
    error: object,
    reset: () => void
}
type ErrorBoundaryProps = {
    fallback: React.FC<FallBackProps>,
    children: React.ReactNode
}

type ErrorBoundaryState = { error?: object };

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {} as ErrorBoundaryState;
    }
    state: { error?: object } = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return {error: error};
    }
    reset = () => {
        this.setState({ error: null })
    }

    componentDidCatch(error: Error, info: any) {
        // Example "componentStack":
        //   in ComponentThatThrows (created by App)
        //   in ErrorBoundary (created by App)
        //   in div (created by App)
        //   in App
        // logErrorToMyService(error, info.componentStack);
        console.log(error.message, info.componentStack)
    }

    render() {
        const state = this.state as ErrorBoundaryState;
        const props = this.props as ErrorBoundaryProps;
        if (state.error !== undefined) {
            return <props.fallback error={state.error} reset={this.reset}/>;
        }
        return props.children;
    }
}
