import { IsArray, IsString, ValidateNested } from "class-validator";
import { plainToInstance, Type } from "class-transformer";

export class Test {
  @IsString()
  code: string;

  @IsString()
  lang: string;
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCase)
  customTests: TestCase[];

  constructor(code: string, lang: string, customTests: { input: string, output: string }[]) {
    this.code = code;
    this.lang = lang;
    this.customTests = plainToInstance(TestCase, customTests);
  }
}

class TestCase {
  @IsString()
  input: string;
  @IsString()
  output: string;

  constructor(input: string, output: string) {
    this.input = input;
    this.output = output;
  }
}
