<template>
	<div class="detail min-h-screen" v-if="isDetail">
		<!-- <div class="header px-8 py-4 text-lg">
			<button @click="isBack" class="back focus:outline-none shadow-lg text-white rounded-full p-2 justify-center flex">
				<i class="fas fa-arrow-left ikon"></i>
			</button>
			<p class="text-white text-center pb-4">{{state.users.length}} members</p>
    </div> -->
		<div class="detail-main">
			<div class="header flex justify-between px-8 pt-4 text-lg">
				<button @click="isBack" class="logout1 focus:outline-none shadow-lg text-white py-1 px-4 rounded-lg ">
					<i class="fas fa-arrow-left"></i>
				</button>
			</div>
				<p class="text-white text-center pb-4">{{state.users.length}} members</p>
		</div>

		<section class="list-members">
			<div class="px-2">
				<div 
					v-for="(message, index) in state.users" 
					:key="index"
					class="py-2"	
				>
					<p class="text-2xl"><i class="fas fa-user-circle"></i> <span class="pl-2">{{message.name}}</span></p>
				</div>
			</div>
    </section>
	</div>
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
  
  <div class="view chat" v-if="isChat">
    <header class="flex justify-between px-8 pt-4 text-lg">
      <!-- <h1 class="text-2xl font-bold">{{ state.username }}</h1> -->
			<button class="logout1 focus:outline-none shadow-lg text-white py-1 px-4 rounded-lg ">
				<i class="fas fa-user"></i>
				<span class="ml-2">{{ state.username }}</span>
			</button>
      <button class="logout1 shadow-lg text-white p-2 rounded-full flex" @click="Logout">
				<i class="fas fa-power-off"></i>
			</button>
    </header>
		<button class="focus:outline-none ">
			<p @click="setDetail" class="text-white text-center pb-4 ">{{state.users.length}} members</p>
		</button>
    
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

    <footer class="px-4 py-2">
      <form @submit.prevent="SendMessage">
        <input 
					class="rounded-full" 
          type="text" 
          v-model="inputMessage" 
          placeholder="Type a message" />
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
      messages: [],
			users: []
    });

		let isDetail = ref(false)
		let isChat = ref(false)
		// let isBack = ref(false)

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
			isChat.value = true
			isDetail.value = false
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
				let users = []

        Object.keys(data).forEach(key => {
					// console.log('users 1', users)
          messages.push({
            id: key,
            username: data[key].username,
            content: data[key].content,
            jam: data[key].jam,
            menit: data[key].menit
          });
					users.push({
            name: data[key].username
          });
        });

        state.messages = messages;
				// console.log('users', users.name)
				// var unique = users.filter(onlyUnique);
				state.users = users.filter((v,i,a)=>a.findIndex(t=>(t.name === v.name))===i)

				console.log('state.users',state.users);
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
			cek,
			isDetail,
			isChat,
			setDetail,
			isBack
    }

		function setDetail() {
			isChat.value = false
			isDetail.value = true
		}

		function isBack(){
			isChat.value = true
			isDetail.value = false
		}

		function cek(){
			// var a = ['a', 1, 'a', 2, '1'];
			// var data = state.messages.[key].username
			// var unique = data.filter(onlyUnique);

			// console.log(unique);
		}

  }
}
</script>

<style lang="postcss" scoped>

.list-members {
	@apply min-h-screen bg-white p-8;
	border-radius: 24px 24px 0px 0px;
}
.detail {
	background: #6C5DD3;
}
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

.back {
	background: #5a4bbe;
	svg {
		width: 20px !important;
		height: 20px !important;
	}
}

.detail {
	.header {
		background: #6C5DD3;
	}
}

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
			// padding: 30px;
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
