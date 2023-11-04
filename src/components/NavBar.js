import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function NavBar() {
    return <div className="flex justify-between p-7">
        <h1 className="text-3xl font-bold">Formify</h1>
        <ConnectButton />
    </div>
}