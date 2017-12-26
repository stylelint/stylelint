<style lang="sugarss">
/* should trigger warning ("block-no-empty") but is parsable - should not trigger syntax error */
a
</style>
<script>
export default {
  data () {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>
