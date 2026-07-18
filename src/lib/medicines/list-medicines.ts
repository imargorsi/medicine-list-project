import { connectDb } from "../db/mongoose";
import Medicine from "../models/medicine";
import { serializeMedicine } from "../serializers/medicine";
import { ListMedicinesQuery } from "../validators/medicine";

export async function listMedicines(query: ListMedicinesQuery) {


    
        const { search } = query;

        await connectDb();

        const escaped = search?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


        const filter = search ? { name: { $regex: escaped, $options: "i" } } : {};

        const medicine = await Medicine.find(filter).sort({ name: 1 });

        return medicine.map(serializeMedicine);


    

  
}