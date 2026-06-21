import { useState, useEffect } from "react";
import { AxiosError } from "axios";

import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function Emprestimos() {
    return (
        <h1>Empréstimos</h1>
    )
} 