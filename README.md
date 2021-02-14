# Recuperação de senha

**RF**

- O usuário deve poder recuperar sua senha informando seu email;
- O usuário deve receber um email com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF**

- Utilizar Mailtrap para testar envios em ambiente de desenvolvimento;
- Utilizar o o Amazon SES para envios em produção;
- O envio de emails deve acontecer em 2º plano (background job);


**RN**

- O link enviado por email para resetar a senha deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar;


# Atualização do perfil

**RF**

- O usuário deve poder atualizar seu nome, email e senha;

**RNF**

- N/A

**RN**

- O usuário não pode alterar seu email para um email já utilizado;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar a nova senha;

# Painel do prestador

**RF**

- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder vizualizar as notificações não lidas;

**RNF**

- Os agendamentos do prestador em dia devem ser armazenadas em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo real utilizando Socket.io;


**RN**

- A notificação deve ter um status de lida ou não-lida para que o prestador possa controlar;

# Agendamento de serviços

**RF**

- O usuário deve poder listar todos os prestadores de seriço cadastrados;
- O usuário deve poder vizualizar os dias de um mês com pelo menos um horário disponível de um prestador;
- O usuário deve poder listar os horários disposĩveis em um dia específico de um prestador;
- O usuário deve poder realizar um agendamento com um prestador;

**RNF**

- A listagem de prestadores devem ser armazenadas em cache;


**RN**

- Cada agendamento deve durar 1h;
- Os agendamentos devem estar disponíveis entre 8h às 18h (primeiro as 8h e último as 17h)
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviços consigo mesmo;
