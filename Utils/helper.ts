// src/utils/Helpers.ts

// Formata uma data para uma string legível
export function formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Calcula a diferença em dias entre duas datas
export function daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // horas*minutos*segundos*milissegundos
    const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
    return diffDays;
}

// Formata um número como moeda (R$)
export function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Gera um ID único
export function generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Calcula a duração de uma rota em formato legível
export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
        return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}`;
    } else {
        return `${remainingMinutes}min`;
    }
}

// Valida um número de placa de veículo (formato brasileiro)
export function isValidLicensePlate(plate: string): boolean {
    const plateRegex = /^[A-Z]{3}[0-9]{4}$/;
    return plateRegex.test(plate);
}

// Adicionando às funções existentes...

// Formata distâncias grandes
export function formatDistance(km: number): string {
    return km >= 1000 ? `${(km / 1000).toFixed(1)} mil km` : `${km} km`;
}

// Retorna uma cor baseada no status da rota
export type RouteStatus = 'Em Progresso' | 'Pendente' | 'Concluído' | 'Cancelado';

export function getStatusColor(status: RouteStatus): string {
    const colors: Record<RouteStatus, string> = {
        'Em Progresso': '#FFA500',
        'Pendente': '#3498DB',
        'Concluído': '#2ECC71',
        'Cancelado': '#E74C3C'
    };
    return colors[status] || '#7F8C8D';
}

// Trunca um texto longo e adiciona reticências
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

// Gera um resumo da rota
export function generateRouteSummary(route: any): string {
    return `${truncateText(route.startLocation, 20)} → ${truncateText(route.endLocation, 20)}`;
}