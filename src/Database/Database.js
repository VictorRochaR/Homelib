/* eslint-disable prettier/prettier */
import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "TarefasDB";
const database_version = "1.0";
const database_displayname = "SQLite Offline TarefasDB";
const database_size = 20000;

export default class Database { 
    initDB() {  
        let db;
        return new Promise((resolve) => {
            console.log("Checando a integridade do plugin ...");    
            SQLite.echoTest().then(() => {        
                console.log("Integridade Ok ...");        
                console.log("Abrindo Banco de Dados ...");        
                SQLite.openDatabase(database_name, database_version, database_displayname, database_size).then(DB => {
                    db = DB;            
                    console.log("Banco de dados Aberto");            
                    db.executeSql('SELECT 1 FROM TarefasTb LIMIT 1').then(() => {
                        console.log("O banco de dados está pronto ... Executando Consulta SQL ...");
                    }).catch((error) =>{
                        console.log("Erro Recebido: ", error);
                        console.log("O Banco de dados não está pronto ... Criando Dados");
                        db.transaction((tx) => {
                            tx.executeSql('CREATE TABLE IF NOT EXISTS TarefasTb (Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nome varchar(30), data varchar(30), prioridade MEDIUMTEXT)');
                        }).then(() => {
                            console.log("Tabela criada com Sucesso");                
                        }).catch(error => {                    
                            console.log(error);                
                        });            
                    });            
                resolve(db);          
            }).catch(error => {           
                console.log(error);          
            });      
        }).catch(error => {        
            console.log("echoTest Falhou - plugin não funcional");      
        }); 
    }); 
    }; 
    closeDatabase(db) {  
        if (db) {    
            console.log("Fechando Banco de Dados");    
            db.close().then(status => {        
                console.log("Banco de dados Desconectado!!");      
            }).catch(error => {        
                this.errorCB(error);      
            });  
        } else {    
            console.log("A conexão com o banco não está aberta");  
        } 
    }; 

    Listar() { 
        return new Promise((resolve) => {
            const lista = [];
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT * FROM TarefasTb', []).then(([tx, results]) => {
                        console.log("Consulta completa");
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            const { Id, nome, data, prioridade } = row;
                            lista.push({ Id, nome, data, prioridade });
                        }
                        console.log(lista);
                        resolve(lista);
                    });
                }).then((result) => {
                    this.Desconectar(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }
    Inserir(item) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    //Query SQL para inserir um novo registro 
                    tx.executeSql('INSERT INTO TarefasTb (nome, data, prioridade) VALUES (?, ?, ?)', [item.nome, item.data, item.prioridade]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    Remover(Id){
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('DELETE FROM TarefasTb WHERE Id = ?', [Id]).then(([tx, results]) => {
                        console.log(results);
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }
}         