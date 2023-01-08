import { P2p } from "qiwi-sdk";
import { Express } from "express";

export let p2p: P2p;

async function setup(app: Express) {
    if (!process.env.QIWI_P2P_PUBLIC) {
        throw new Error("QIWI_P2P_PUBLIC must be provided")
    }

    if (!process.env.QIWI_P2P_SECRET) {
        throw new Error("QIWI_P2P_SECRET must be provided")
    }

    p2p = P2p.create(process.env.QIWI_P2P_SECRET, process.env.QIWI_P2P_PUBLIC);
}

export default setup;