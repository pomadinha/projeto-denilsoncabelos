# Configuração da área administrativa

O catálogo foi adaptado para usar a estrutura visual recuperada e a coleção `produtos` do Firebase que aparece nos arquivos enviados pelo seu amigo. O painel está em `admin.html`.

## O que o painel faz

- Entrar com e-mail e senha do proprietário pelo Firebase Authentication.
- Cadastrar, editar e excluir produtos.
- Alterar preço, descrição, categoria e disponibilidade.
- Usar várias imagens por produto: caminhos em `assets/`, links `https://` ou fotos selecionadas no dispositivo.
- Mostrar no catálogo público os registros salvos na coleção `produtos` do Firestore.
- Importar os produtos e descrições do catálogo recuperado na primeira ativação.

A senha não fica escrita no JavaScript. As permissões de escrita são controladas pelas regras do Firestore.

## 1. Escolha o projeto Firebase

O arquivo `firebase-config.js` conserva a configuração web encontrada no ZIP administrativo enviado. Para esse projeto funcionar, você precisa ter acesso ao projeto Firebase correspondente. Se ele pertencer ao seu amigo, peça que ele compartilhe acesso ao projeto. Se preferir usar um projeto seu, crie um app Web no Firebase e substitua o objeto `firebaseConfig` de `firebase-config.js` pelos valores exibidos em **Configurações do projeto → Seus apps → Configuração do SDK**.

A configuração web não contém a senha do proprietário. Não coloque uma chave de conta de serviço, senha, token ou arquivo privado no repositório.

## 2. Ative o login por e-mail e senha

No Console do Firebase:

1. Abra **Authentication → Começar**.
2. Em **Sign-in method**, ative **E-mail/senha**.
3. Em **Users**, crie manualmente a conta do proprietário. Não existe cadastro público no painel.
4. Copie o **UID** dessa conta.
5. Em **Authentication → Settings → Authorized domains**, adicione o domínio do site no Vercel. Para testar localmente, adicione `localhost`.

## 3. Crie o Firestore e aplique as regras

1. Abra **Firestore Database** e crie o banco na edição Standard, em modo de produção.
2. Abra o arquivo `firestore.rules`.
3. Troque `COLE_AQUI_O_UID_DO_PROPRIETARIO` pelo UID copiado no passo anterior.
4. Cole as regras completas em **Firestore Database → Rules** e clique em **Publish**.
5. Abra `admin-config.js` e coloque o mesmo UID em `UID_PROPRIETARIO`.

O Firebase precisa ser aberto por um servidor HTTP. Para testar no computador, use o Live Server do VS Code em `http://localhost:5500`; não abra os HTMLs diretamente com `file://`.

As regras permitem leitura pública dos produtos e bloqueiam gravações, alterações e exclusões para qualquer usuário que não tenha o UID autorizado.

## 4. Publique e ative o catálogo

1. Envie os arquivos do projeto para o GitHub e publique a branch correta no Vercel.
2. Acesse `https://SEU-DOMINIO/admin.html`.
3. Entre com o e-mail e a senha cadastrados no Firebase.
4. Clique em **Publicar catálogo atual no banco**. Isso copia os produtos do `produtos.js` recuperado para a coleção `produtos`.
5. Edite um preço ou descrição e salve. Reabra o catálogo público para conferir a mudança.

Se já houver registros antigos no Firestore, o botão informa que os produtos com IDs iguais serão atualizados. Outros registros serão mantidos; você pode removê-los pelo painel.

## Imagens

As imagens que já existem no catálogo continuam nos caminhos `assets/...`. Para cadastrar uma foto pelo painel, escolha o arquivo no formulário. O navegador reduz a imagem e grava o resultado junto ao documento do produto no Firestore, sem usar Firebase Storage. Por causa do limite de tamanho de um documento Firestore, o painel bloqueia mais de aproximadamente 700 KB em imagens codificadas por produto. Para galerias maiores, mantenha as fotos em `assets/` e informe os caminhos, um por linha.

## Plano gratuito

A solução usa Firebase Authentication e Cloud Firestore, sem servidor pago e sem Firebase Storage. O plano gratuito tem cotas; acompanhe o uso no Console Firebase. Ao ultrapassar uma cota, as operações correspondentes podem falhar até a renovação ou mudança de plano.
