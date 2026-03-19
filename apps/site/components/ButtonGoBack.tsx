'use client'


export default function GoBackButton(props: React.HTMLAttributes<HTMLButtonElement>) {

    return (
        <button {...props} onClick={() => history.back()}/>
    )
}