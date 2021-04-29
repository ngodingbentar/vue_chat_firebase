<template>
  <div class="view login" v-if="state.username === '' || state.username === null">
    <form class="login-form" @submit.prevent="Login">
      <div class="form-inner">
				<div class="icon">
					<img src="/chat.png" alt="https://www.flaticon.com" />
					<!-- <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> -->
				</div>
				<p class="text-center text-2xl font-bold my-4">NB-CHAT</p>
        <input
					class="rounded-full" 
          type="text" 
          v-model="inputUsername" 
          placeholder="Username..." />
        <input 
					class="rounded-full" 
          type="submit" 
          value="Login" />
      </div>
    </form>
  </div>
  
  <div class="view chat" v-else>
    <header class="flex justify-between px-8 py-6 text-xl">
      <!-- <h1 class="text-2xl font-bold">{{ state.username }}</h1> -->
			<button class="logout1 shadow-lg text-white py-2 px-4 rounded-lg ">
				<i class="fas fa-user"></i>
				<span class="ml-2">{{ state.username }}</span>
			</button>
      <button class="logout1 shadow-lg text-white py-2 px-4 rounded-lg " @click="Logout">Logout</button>
    </header>
    
    <section class="chat-box">
      <div 
        v-for="message in state.messages" 
        :key="message.key" 
        :class="(message.username == state.username ? 'message current-user' : 'message other-user')">
        <div class="message-inner">
          <div v-if="message.username != state.username" class="username">{{ message.username }}</div>
					<div v-if="message.username != state.username" class="flex">
						<div class="content shadow-md ">{{ message.content }}</div>
						<p class="mt-2 ml-2 text-gray-400">{{message.jam}}:{{message.menit}}</p>
					</div>
					<div v-else class="flex">
						<p class="mt-2 mr-2 text-gray-400">{{message.jam}}:{{message.menit}}</p>
						<div class="content shadow-md ">{{ message.content }}</div>
					</div>
        </div>
      </div>
    </section>

    <footer>
      <form @submit.prevent="SendMessage">
        <input 
					class="rounded-full" 
          type="text" 
          v-model="inputMessage" 
          placeholder="Write a message..." />
				<button class="logout1 ml-2 shadow-lg focus:outline-none text-white py-2 px-4 rounded-full ">
					<i class="fas fa-paper-plane"></i>
				</button>
        <!-- <input 
          type="submit" 
          value="Send" /> -->
      </form>
    </footer>
  </div>
</template>

<script>
import { reactive, onMounted, ref, computed } from 'vue';
import db from './db.js';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
export default {
  setup () {
    const inputUsername = ref("");
    const inputMessage = ref("");

    const state = reactive({
      username: "",
      messages: []
    });

		const jam = computed(() => {
			return new Date().getHours();
		})

		const menit = computed(() => {
			return new Date().getMinutes();
		})

    const Login = () => {
      if (inputUsername.value != "" || inputUsername.value != null) {
        state.username = inputUsername.value;
        inputUsername.value = "";
      }
    }

    const Logout = () => {
      state.username = "";
    }

    const SendMessage = () => {
      const messagesRef = db.database().ref("messages");

      if (inputMessage.value === "" || inputMessage.value === null) {
        return;
      }

      const message = {
        username: state.username,
        content: inputMessage.value,
				jam: new Date().getHours().toString(),
				menit: new Date().getMinutes().toString(),
      }

      messagesRef.push(message);
      inputMessage.value = "";
    }

    onMounted(() => {
      const messagesRef = db.database().ref("messages");

      messagesRef.on('value', snapshot => {
        const data = snapshot.val();
        let messages = [];

        Object.keys(data).forEach(key => {
          messages.push({
            id: key,
            username: data[key].username,
            content: data[key].content,
            jam: data[key].jam,
            menit: data[key].menit
          });
        });

        state.messages = messages;
      });
    });


    return {
      inputUsername,
      Login,
      state,
			jam,
			menit,
      inputMessage,
      SendMessage,
      Logout,
			cek
    }

		function cek(){
			console.log('message')
		}
  }
}
</script>

<style lang="postcss" scoped>
.icon {
	@apply text-center flex items-center w-full m-auto;
}

.icon img{
	@apply m-auto;
	max-width: 100px;
}

.logout1 {
	background: #5a4bbe;
}
</style>

<style lang="scss">

* {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

.view {
	display: flex;
	justify-content: center;
	min-height: 100vh;
	background-color: #6C5DD3;
	
	&.login {
		align-items: center;
		.login-form {
			display: block;
			width: 100%;
			padding: 15px;
			
			.form-inner {
				display: block;
				background-color: #FFF;
				padding: 50px 15px;
				border-radius: 16px;
				box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);

				h1 {
					color: #AAA;
					font-size: 28px;
					margin-bottom: 30px;
				}

				label {
					display: block;
					margin-bottom: 5px;
					color: #AAA;
					font-size: 16px;
					transition: 0.4s;
				}

				input[type="text"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;

					display: block;
					width: 100%;
					padding: 10px 15px;
					// border-radius: 8px;
					margin-bottom: 15px;
					
					color: #333;
					font-size: 18px;

					box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
					background-color: #F3F3F3;

					transition: 0.4s;

					&::placeholder {
						color: #888;
						transition: 0.4s;
					}
				}

				input[type="submit"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;

					display: block;
					width: 100%;
					padding: 10px 15px;
					background-color: #6C5DD3;
					// border-radius: 8px;

					color: #FFF;
					font-size: 18px;
					font-weight: 700;
				}

				&:focus-within {
					label {
						color: #6C5DD3;
					}

					input[type="text"] {
						background-color: #FFF;
						box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);

						&::placeholder {
							color: #666;
						}
					}
				}
			}
		}
	}

	&.chat {
		flex-direction: column;

		header {
			// position: relative;
			// display: block;
			// width: 100%;
			// padding: 50px 30px 10px;

			.logout {
				position: absolute;
				top: 15px;
				right: 15px;
				appearance: none;
				border: none;
				outline: none;
				background: none;
				
				color: #FFF;
				font-size: 18px;
				margin-bottom: 10px;
				text-align: right;
			}

			h1 {
				color: #FFF;
			}
		}

		.chat-box {
			border-radius: 24px 24px 0px 0px;
			background-color: #FFF;
			box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
			flex: 1 1 100%;
			padding: 30px;

			.message {
				display: flex;
				margin-bottom: 15px;
				
				.message-inner {
					.username {
						color: #888;
						font-size: 16px;
						margin-bottom: 5px;
						// padding-left: 15px;
						// padding-right: 15px;
					}

					.content {
						display: inline-block;
						padding: 10px 20px;
						background-color: #F3F3F3;
						// border-radius: 999px;
						color: #333;
						font-size: 18px;
						line-height: 1.2em;
						text-align: left;
					}
				}

				&.current-user {
					margin-top: 30px;
					justify-content: flex-end;
					text-align: right;

					.message-inner {
						max-width: 75%;

						.content {
							color: #FFF;
							font-weight: 600;
							background-color: #6C5DD3;
							border-top-left-radius: 12px !important;
							border-bottom-left-radius: 12px !important;
							border-bottom-right-radius: 12px !important;
						}
					}
				}
			}
		}

		footer {
			position: sticky;
			bottom: 0px;
			background-color: #FFF;
			padding: 30px;
			box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);

			form {
				display: flex;

				input[type="text"] {
					flex: 1 1 100%;

					appearance: none;
					border: none;
					outline: none;
					background: none;

					display: block;
					width: 100%;
					padding: 10px 15px;
					// border-radius: 8px 0px 0px 8px;
					
					color: #333;
					font-size: 18px;

					box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
					background-color: #F3F3F3;

					transition: 0.4s;

					&::placeholder {
						color: #888;
						transition: 0.4s;
					}
				}
				
				input[type="submit"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;

					display: block;
					padding: 10px 15px;
					border-radius: 0px 8px 8px 0px;

					background-color: #6C5DD3;

					color: #FFF;
					font-size: 18px;
					font-weight: 700;
				}
			}
		}
	}
}
.other-user{
	.message-inner {
					.content{
						border-top-right-radius: 12px;
						border-bottom-left-radius: 12px;
						border-bottom-right-radius: 12px;
					}

	}
				}
</style>
