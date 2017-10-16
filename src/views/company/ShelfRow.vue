<template>
    <div>
        <Row>
            <Col span="6">
                 <Checkbox v-model="shelf.need" @on-change="need">{{shelf.height}}m</Checkbox>    
            </Col>
            <Col span="1">
                 x    
            </Col>
            <Col span="8">
                 <InputNumber :max="10" :min="0" v-model="shelf.count" size="small" style="width:50px" @on-change="selectCount" :disabled="disabled"></InputNumber>个 
            </Col> 
        </Row>        
    </div>
</template>
<script>
    export default {
        data(){
            return {
                disabled: !this.shelf.need,
            }
        },
        props: {
            shelf: Object
        },
        methods: {
            selectCount(count){
                //console.info(count);
            },
            need(){
                this.disabled = !this.disabled;

            }
        },
        mounted(){}

    }
</script>
<style scoped>
  
</style>