/**
 * Design Pattern: Observer
 * Sistema de eventos para notificar observadores sobre mudanças
 */
class Observer {
    constructor() {
        this.observers = {};
    }
    
    subscribe(event, callback) {
        if (!this.observers[event]) {
            this.observers[event] = [];
        }
        this.observers[event].push(callback);
        
        // Retorna função para cancelar inscrição
        return () => {
            this.observers[event] = this.observers[event].filter(cb => cb !== callback);
        };
    }
    
    notify(event, data) {
        if (this.observers[event]) {
            this.observers[event].forEach(callback => callback(data));
        }
    }
    
    clear(event) {
        if (event) {
            delete this.observers[event];
        } else {
            this.observers = {};
        }
    }
}

export default Observer;

