

<script>
  import Layout from './Layout.svelte';
  export let message;  
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<Layout>
  <h1>{message}</h1>    
  <img src="profile.jpeg" alt="background" />
</Layout>

<style>
  @font-face {
    font-family: 'OPTIEngraversOldEnglish';
    src: url('OPTIEngraversOldEnglish.woff') format('woff');
  }

  @font-face {
        font-family: 'Gelasio';
        font-style: normal;
        font-weight: 400;
        src: local('Gelasio Regular'), local('Gelasio-Regular'), url(https://fonts.gstatic.com/s/gelasio/v1/cIf9MaFfvUQxTTqS9C6hYQ.woff2) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    
  h1 {
    font-family: "OPTIEngraversOldEnglish";
    font-size: 30;
  }
</style>