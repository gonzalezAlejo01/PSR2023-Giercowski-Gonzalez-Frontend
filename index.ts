import { routerComentario } from "./Controladores/ControladorComentario";
import { routerPublicacion } from "./Controladores/ControladorPublicacion";
import { routerUsuario } from "./Controladores/ControladorUsuario";
import cors from "cors";
import { verifyToken } from "./JWT/key";
const express = require('express')

const app = express();

app.get("/", (req: any, res: any) => {
  res.send("Bienvenido a mi API")
});

app.use(express.json());
app.use(cors(),routerUsuario);
app.use(cors(), routerPublicacion)
app.use(cors(), routerComentario)

app.listen(3000, () => {
    console.log("Api corriendo");
  });